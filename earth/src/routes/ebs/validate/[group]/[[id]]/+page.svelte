<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
  import { setIsEBSaved, useIsEBSaved } from "$lib/client/firebase/database.js";
  import Button from "$lib/components/Button.svelte";
  import {
    exofopLinkOf,
    fileNameToEBID,
    fliLinkOf,
    latteLinkOf,
  } from "$lib/util";
  import Star from "svelte-material-icons/Star.svelte";
  import ChevronRight from "svelte-material-icons/ChevronRight.svelte";
  import LinkLine from "$lib/components/LinkLine.svelte";
  import { saveable, sharingSaveable, type Saveable } from "$lib/client/saveables.js";
  import { EBQuestions } from "$lib/api/ebs.js";
  import { ToastType, createToast, deleteToast } from "$lib/client/toasts.js";
  import { onMount } from "svelte";
  import Loading from "$lib/components/Loading.svelte";

  const quickAdds = [
    "CPOC",
    "Additional Eclipses",
    "Low SNR",
    "High SNR",
    "Period Off by Integer",
    "Difficult Lightcurve",
    "Scndry Phase Wrong",
    "Strong Systemics",
    "Needs More Eyes",
  ];

  export let data;
  $: file = data.file;

  $: id = fileNameToEBID(file?.name || "");
  $: starred = useIsEBSaved(data.group.id, id);

  onMount(() => {
    if (data.done) {
      createToast(
        ToastType.SUCCESS,
        "No EBs Left",
        `Validation is completed for group <span>${data.group.name}</span>`
      );

      goto("/ebs/validate");
    }
  });

  $: saveableObj = {
    link: "/ebs/lookup/" + id,
    type: "image",
    data: {
      name: "<span>EB</span> TIC " + id,
      img: file?.webContentLink || "",
    },
  } as Saveable;

  let step = 1;
  let responses: (boolean | string)[] = [];
  let inputVal = "";

  $: step, (inputVal = "");

  let submitting = false;

  async function registerYes() {
    if (!file) return;

    if (step - 1 === EBQuestions.length) {
      if (submitting) return;

      let toastId = createToast(
        ToastType.INFO,
        "Submitting...",
        "Submitting EB Response for <span>TIC " + id + "</span>"
      );

      submitting = true;
      await submit();

      deleteToast(toastId);

      return;
    }

    if (EBQuestions[step - 1].type === "boolean") {
      responses[step - 1] = true;
      step++;
    } else {
      responses[step - 1] = inputVal;
      step++;
    }
  }

  function registerNo() {
    if (!file) return;

    if (step - 1 === EBQuestions.length) {
      reset();
      return;
    }

    if (EBQuestions[step - 1].type === "boolean") {
      responses[step - 1] = false;

      if (step === 1) {
        responses[step] = false;
        step++;
      }

      step++;
    }
  }

  async function submit() {
    let res = await fetch(`/api/set/eb-res/${data.group.id}/${id}`, {
      method: "POST",
      body: JSON.stringify({ responses }),
    });

    if (res.ok) {
      if (data.static) {
        goto("/ebs/lookup/" + id);
        file = null;
      } else {
        invalidate("/api/get/random-eb/" + data.group.id);
        file = null;
      }

      createToast(
        ToastType.SUCCESS,
        "Submitted",
        "EB Response submitted for <span>TIC " + id + "</span>"
      );
      reset();

      if (data.static) goto("/ebs/lookup/" + id);
    } else {
      createToast(
        ToastType.ERROR,
        "Error",
        "Failed to submit EB Response for TIC " + id
      );
    }
  }

  function reset() {
    step = 1;
    responses = [];
    submitting = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if ($sharingSaveable) return;

    if (e.key === "Enter") {
      registerYes();
      e.preventDefault();
    } else if (
      e.key === "Backspace" &&
      (!EBQuestions[step - 1] || EBQuestions[step - 1].type === "boolean")
    ) {
      registerNo();
      e.preventDefault();
    }

    if (
      e.ctrlKey &&
      !isNaN(parseInt(e.key)) &&
      EBQuestions[step - 1].type === "text"
    ) {
      inputVal += inputVal.length
        ? ", " + quickAdds[parseInt(e.key) - 1]
        : quickAdds[parseInt(e.key) - 1];
      e.preventDefault();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
  <title>Exogram - {data.group.name} EB Validation</title>
</svelte:head>

{#if data.userComplete}
  <div class="panel semi green">
    Out of EBs!
    <div class="sub">
      You have responded to every EB in group <strong>{data.group.name}</strong>
    </div>
  </div>
{:else if file === null}
  {#if data.static}
    <Loading />
  {:else}
    <div class="panel semi">Loading Random EB</div>
  {/if}
{:else}
  <div class="title">
    <div>
      <Button on:click={() => setIsEBSaved(data.group.id, id, !$starred)}
        ><div class="star" class:active={$starred}><Star /></div></Button
      >
      <div class="text" use:saveable={saveableObj}>
        TIC {fileNameToEBID(id)}
      </div>
      <div class="group">EB:{data.group.name}</div>
    </div>
    <div class="links">
      <LinkLine
        newTab
        links={{
          ExoFOP: exofopLinkOf(id),
          FLI: fliLinkOf(id),
          LATTE: latteLinkOf(id),
        }}
      />
    </div>
  </div>
  <div class="content">
    <div class="panel">
      <div class="main">
        <div class="title">
          Validate <div class={`steps`}>
            {#each [1, 2, 3] as i}
              <div class="step" class:active={step === i} class:done={step > i}>
                {i}
              </div>
            {/each}
          </div>
        </div>
        <div class="questions">
          {#each EBQuestions.slice(0, step) as q, i}
            <div
              class="question"
              class:active={step - 1 === i || !EBQuestions[step - 1]}
            >
              <div class="text">
                {@html q.text}
              </div>
              <div class="res">
                {responses[i] !== undefined
                  ? typeof responses[i] === "boolean"
                    ? responses[i]
                      ? "Yes"
                      : "No"
                    : responses[i]
                  : ""}
              </div>
            </div>
            {#if i < step - 1 && i !== EBQuestions.length - 1}
              <div class="spacer" />
            {/if}
          {/each}
        </div>
      </div>
      <div class="input">
        {#if step - 1 === EBQuestions.length}
          <div class="btns">
            <Button on:click={registerYes}>
              <div class="btn submit">
                Submit
                <kbd>
                  <span class="enter">↵</span>
                </kbd>
              </div>
            </Button>
            <Button on:click={registerNo}>
              <div class="spacer" />
              <div class="btn reset">
                Reset
                <kbd>
                  <span class="delete">⌦</span>
                </kbd>
              </div>
            </Button>
          </div>
        {:else if EBQuestions[step - 1].type === "boolean"}
          <div class="btns">
            <Button on:click={registerYes}>
              <div class="btn yes">
                Yes
                <kbd>
                  <span class="enter">↵</span>
                </kbd>
              </div>
            </Button>
            <div class="spacer" />
            <Button on:click={registerNo}>
              <div class="btn no">
                No
                <kbd>
                  <span style:transform="rotate(180deg)">⌦</span>
                </kbd>
              </div>
            </Button>
          </div>
        {:else}
          <div class="text">
            <div class="input-wrapper">
              <!-- svelte-ignore a11y-autofocus -->
              <div class="input-key-wrapper">
                <input autofocus bind:value={inputVal} placeholder="Comments" />
                <kbd>
                  <span class="enter">↵</span>
                </kbd>
              </div>
              <Button on:click={registerYes}>
                <div class="btn"><ChevronRight /></div>
              </Button>
            </div>
            <div class="quick-adds">
              {#each quickAdds as qa, i}
                <Button
                  on:click={() => {
                    inputVal += inputVal.length ? ", " + qa : qa;
                  }}
                >
                  <div class="quick-add">
                    {qa}

                    <div>
                      <div class="key">{i + 1}</div>
                    </div>
                  </div>
                </Button>
              {/each}
              <div class="instr">
                Use <span>CTRL + 1-9</span> to quickly add text to your comment.
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div use:saveable={saveableObj}>
      <img src={file.webContentLink} alt="EB File" />
    </div>
  </div>
{/if}

<style lang="scss">
  .title {
  	display: flex;
  	align-items: center;
  	flex-direction: column;

  	> div {
  		display: flex;
  		align-items: center;
  		justify-content: center;
  	}

  	.links {
  		font-weight: $fw-reg;

  		width: 11em;
  		margin-bottom: 0.25em;
  	}

  	.text {
  		margin: 0 0.25em;
  	}

  	.star {
  		font-size: 0.9em;

  		display: flex;
  		align-items: center;
  		justify-content: center;

  		width: 1.1em;
  		height: 1.1em;

  		cursor: pointer;
  		transition: $transition;

  		border-radius: $border-radius-small;
  		background: d($primary, 7);

  		&:hover {
  			background: d($primary, 5);
  		}

  		&.active {
  			color: $bkg;
  			background: $primary;
  		}
  	}

  	.group {
  		font-size: 0.5em;
  		font-weight: $fw-reg;

  		display: flex;
  		align-items: center;
  		justify-content: center;

  		height: 2em;
  		padding: 0 0.4em;

  		color: $bkg;
  		border-radius: $border-radius-small;
  		background: $secondary;
  	}
  }

  .content {
  	display: flex;
  	justify-content: center;

  	.panel {
  		display: flex;
  		flex-direction: column;
  		justify-content: space-between;
  	}

  	.title {
  		display: flex;
  		align-items: center;
  		flex-direction: row;
  		justify-content: center;
  	}

  	.steps {
  		font-weight: $fw-reg;

  		display: flex;
  		justify-content: center;

  		margin-left: 1rem;

  		.step {
  			font-size: 0.5em;

  			display: flex;
  			align-items: center;
  			justify-content: center;

  			width: 1.9em;
  			height: 1.9em;
  			margin: 0 0.25rem;

  			border: 2px solid $color;
  			border-radius: 100%;

  			&.active {
  				color: $secondary;
  				border-color: $secondary;
  			}

  			&.done {
  				color: $bkg;
  				border-color: $green;
  				background: $green;
  			}
  		}
  	}

  	.questions {
  		font-size: 1.4em;

  		display: flex;
  		flex-direction: column;

  		.question {
  			display: flex;
  			justify-content: space-between;

  			margin: 0.25em 0;

  			transition: $transition;

  			&:not(.active) {
  				opacity: 0.3;
  			}

  			.text {
  				font-weight: $fw-semi;
  				:global(span) {
  					color: $secondary;
  				}
  			}

  			.res {
  				max-width: 60%;

  				text-align: right;
  			}
  		}

  		.spacer {
  			height: 2px;
  			margin: 0.1em 0;

  			border-radius: $border-radius;
  			background: a($secondary, 3);
  		}
  	}

  	.input {
  		display: flex;

  		.btns {
  			display: flex;

  			width: 100%;

  			.spacer {
  				width: 0.5em;
  			}

  			.btn {
  				font-size: 2em;

  				position: relative;

  				display: flex;
  				align-items: center;
  				flex-grow: 1;
  				justify-content: center;

  				padding: 0.3em;

  				cursor: pointer;
  				transition: $transition;

  				border: 3px solid;
  				border-radius: $border-radius-small;

  				&.yes {
  					color: $green;
  					border-color: $green;

  					&:hover {
  						color: $bkg;
  						background: $green;
  					}
  				}

  				&.no {
  					color: $tertiary;
  					border-color: $tertiary;

  					&:hover {
  						color: $bkg;
  						background: $tertiary;
  					}
  				}

  				&.submit {
  					color: $primary;
  					border-color: $primary;

  					&:hover {
  						color: $bkg;
  						background: $primary;
  					}
  				}

  				&.reset {
  					color: $red;
  					border-color: $red;

  					&:hover {
  						color: $bkg;
  						background: $red;
  					}
  				}

  				kbd {
  					font-size: 0.8em;

  					position: absolute;
  					right: 0.3rem;

  					width: 3rem;
  					height: 3rem;
  				}
  			}
  		}

  		.text {
  			display: flex;
  			flex-direction: column;

  			width: 100%;

  			.input-wrapper {
  				font-size: 1.5em;

  				display: flex;

  				$h: 3.5rem;

  				input {
  					font-size: 0.8em;

  					box-sizing: border-box;
  					width: 100%;
  					height: $h;
  				}

  				.input-key-wrapper {
  					position: relative;

  					flex-grow: 1;

  					kbd {
  						position: absolute;
  						top: 0.125em;
  						right: 0.125em;
  						bottom: 0;

  						width: 2em;
  						height: 2em;
  					}
  				}

  				.btn {
  					font-size: 2.5rem;

  					display: flex;
  					align-items: center;
  					justify-content: center;

  					box-sizing: border-box;
  					width: $h;
  					height: $h;
  					margin-left: 0.25rem;

  					cursor: pointer;
  					transition: $transition;

  					color: $secondary;
  					border: 2px solid $secondary;
  					border-radius: $border-radius-small;

  					&:hover {
  						color: $bkg;
  						background: $secondary;
  					}
  				}
  			}

  			.quick-adds {
  				display: grid;

  				margin-top: 0.25em;

  				border-radius: $border-radius-small;
  				background: d($secondary, 4);

  				grid-template-columns: repeat(3, 1fr);

  				.quick-add {
  					position: relative;

  					display: flex;
  					align-items: center;
  					justify-content: left;

  					padding: 0.5em;

  					cursor: pointer;
  					transition: $transition;

  					border-radius: $border-radius-small;

  					$h: 1.6rem;

  					kbd {
  						margin-left: 0.5rem;
  						&:not(.ctrl) {
  							width: $h;
  							height: $h;
  						}
  					}

  					&:hover {
  						background: d($secondary, 3);
  					}
  				}

  				.instr {
  					margin: 0.5em 0;

  					text-align: center;

  					grid-column: 1/-1;

  					span {
  						font-weight: $fw-bold;

  						color: $secondary;
  					}
  				}
  			}
  		}
  	}

  	img {
  		box-sizing: border-box;
  		width: 45vw;
  		height: 100%;
  		margin-left: 1em;
  		padding: 2em 0;

  		border-radius: $border-radius;
  		background: white;

  		object-fit: cover;
  	}
  }
</style>
