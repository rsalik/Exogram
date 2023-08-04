<script lang="ts">
  import { getUserData } from "$lib/client/firebase/database";
  import EbLeaderboardTable from "$lib/components/table/EBLeaderboardTable.svelte";
  import CheckCircle from "svelte-material-icons/CheckCircle.svelte";
  import Search from "svelte-material-icons/Magnify.svelte";
  import Star from "svelte-material-icons/StarBoxMultiple.svelte";

  export let data;

  $: uids = data.streamed.ebDispCount
    ? Object.keys(data.streamed.ebDispCount)
    : [];

  let usernames: Record<string, string> | undefined;
  $: getUserData(uids, "name").then((u) => {
    usernames = Object.entries(u).reduce(
      (acc, [uid, { name }]) => ({ ...acc, [uid]: name }),
      {}
    );
  });
</script>

<div class="left">
  <div class="title">Eclipsing Binaries</div>
  <div class="links">
    <a class="validate" href="/ebs/validate">
      <div class="icon">
        <CheckCircle />
      </div>
      <div class="text">Validate</div>
    </a>
    <a class="search" href="/ebs/lookup">
      <div class="icon">
        <Search />
      </div>
      <div class="text">Lookup</div>
    </a>
    <a class="starred" href="/ebs/starred">
      <div class="icon">
        <Star />
      </div>
      <div class="text">View Starred</div>
    </a>
  </div>
</div>
<div class="right">
  {#if usernames}
    <div class="title">Leaderboard</div>
    <EbLeaderboardTable data={data.streamed.ebDispCount} {usernames} />
  {:else}
    <div class="panel semi">Loading Leaderboard</div>
  {/if}
</div>

<style lang="scss">
  .left {
  	float: left;

  	width: 49%;
  }

  .right {
  	float: right;

  	width: 49%;
  }

  .links {
  	a {
  		font-size: 2.5em;

  		display: flex;
  		align-items: center;

  		box-sizing: border-box;
  		width: 100%;
  		margin: 0.5rem 0;
  		padding: 1.5rem 0.5em;

  		transition: $transition;

  		border: solid 5px;
  		border-radius: $border-radius;

  		&:hover {
  			color: $bkg !important;
  		}

  		&.validate {
  			color: $primary;
  			border-color: $primary;

  			&:hover {
  				background: $primary;
  			}
  		}
  		&.search {
  			color: $secondary;
  			border-color: $secondary;

  			&:hover {
  				background: $secondary;
  			}
  		}

  		&.starred {
  			color: $tertiary;
  			border-color: $tertiary;

  			&:hover {
  				background: $tertiary;
  			}
  		}

  		.icon {
  			font-size: 1.5em;

  			display: flex;
  			align-items: center;
  			justify-content: center;

  			margin-right: 0.5em;
  		}
  	}
  }
</style>
