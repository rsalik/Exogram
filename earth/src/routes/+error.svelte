<script>
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>
    Exogram - Error {$page.status}
  </title>
</svelte:head>

<div class="page">
  <div class="error-code">
    {$page.status}
  </div>
  <div class="error-message">
    <div class="wrapper">
      <div class="error">{@html $page.error?.message}</div>
    </div>
  </div>
  <span class="path">Path: <span class="mono">{$page.url.pathname}</span></span>
</div>

<style lang="scss">
  .page {
  	position: relative;

  	display: flex;
  	align-items: center;
  	justify-content: center;

  	width: 100%;
  	height: 100%;

  	border-radius: $border-radius;
  	background: $red;

  	.error-code {
  		font-size: 37em;
  		font-weight: 920;

  		position: absolute;
  		left: 5rem;

  		color: d($red);
  	}

  	.error-message {
  		font-size: 3em;
  		line-height: 1em;

  		z-index: 2;

  		width: 80%;
  		margin: 0 auto;

  		text-align: center;

  		color: $bkg;

  		.error {
  			:global(span) {
  				font-weight: $fw-bold;
  			}
  		}

  		.wrapper {
  			display: inline-flex;
  			flex-direction: column;
  		}
  	}

  	.path {
  		font-size: 2em;

  		position: absolute;
  		right: 1.5rem;
  		bottom: 1rem;

  		text-align: right;

  		color: $bkg;

  		.mono {
  			color: d($red, 5);
  		}
  	}
  }
</style>
