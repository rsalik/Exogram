<script>
  import Link from "./Link.svelte";
</script>

<div class="footer">
  <div class="links">
    <div class="col">
      <div class="name">Exogram</div>
      <Link href="/table">TIC Table</Link>
      <Link href="/ebs">EB Home</Link>
      <Link href="/dictionary">Dictionary</Link>
    </div>
    <div class="col">
      <div class="name">Planet Patrol</div>
      <Link href="https://www.theplanetpatrolcollaboration.org/">Home</Link>
      <Link href="https://www.theplanetpatrolcollaboration.org/about-us"
        >About</Link
      >
      <Link href="https://www.zooniverse.org/projects/marckuchner/planet-patrol"
        >Zooniverse</Link
      >
    </div>
    <div class="col">
      <div class="name">Behind the Scenes</div>
      <Link href="https://github.com/Planet-Patrol/Exogram/tree/master"
        >Repository</Link
      >
      <Link href="https://github.com/Planet-Patrol">GitHub Organization</Link>
    </div>
  </div>
</div>

<style lang="scss">
  .footer {
  	position: relative;
  	z-index: 998;

  	display: flex;
  	overflow-x: scroll;

  	padding: 2rem 0.5rem;

  	background: mix($bkg, black, 80%);

  	.links {
  		display: flex;

  		.col {
  			font-size: 1.5rem;

  			display: flex;
  			flex-direction: column;

  			margin: 0 2em;

  			.name {
  				font-size: 1.2em;
  				font-weight: $fw-bold;

  				margin-bottom: 0.5em;
  			}

  			:global(.link) {
  				text-decoration: none !important;
  			}
  		}
  	}
  }
</style>
