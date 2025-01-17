<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-column">
        <h3>Developers</h3>
        <ul>
          <li><a href="https://github.com/balancer">Github</a></li>
          <li><a href="https://github.com/balancer/scaffold-balancer-v3">Starter kit</a></li>
          <li><a href="https://immunefi.com/bug-bounty/balancer/information/">Bug bounties</a></li>
          <li><a href="https://grants.balancer.community/">Grants</a></li>
          <li><a href="https://docs-v2.balancer.fi/">V2 Docs</a></li>
        </ul>
      </div>
      
      <div class="footer-column">
        <h3>Ecosystem</h3>
        <ul>
          <li><a href="https://balancer.fi/pools">Explore pools</a></li>
          <li><a href="https://pool-creator.balancer.fi/">Create pools</a></li>
          <li><a href="https://balancer.fi/swap/ethereum/ETH">Swap tokens</a></li>
          <li><a href="https://balancer.fi/swap/ethereum/ETH">Get veBAL</a></li>
          <li><a href="https://balancer.fi/swap/ethereum/ETH">Create an LBP</a></li>
        </ul>
      </div>
      
      <div class="footer-column">
        <h3>Community</h3>
        <ul>
          <li><a href="https://forum.balancer.fi/">Forum</a></li>
          <li><a href="https://vote.balancer.fi/#/">Governance</a></li>
          <li><a href="https://discord.balancer.fi/">Discord</a></li>
          <li><a href="https://x.com/Balancer">Twitter</a></li>
          <li><a href="https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow">Youtube</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 3rem 2rem;
  background-color: var(--c-bg);
  border-top: 1px solid var(--c-border);
}

.footer-container {
  max-width: var(--content-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.footer-column {
  flex: 1;
}

.footer-column h3 {
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: var(--c-text);
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column ul li {
  margin-bottom: 0.5rem;
}

.footer-column ul li a {
  color: var(--c-text-lighter);
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-column ul li a:hover {
  color: var(--c-brand);
}

@media (max-width: 719px) {
  .footer-container {
    flex-direction: column;
    gap: 2rem;
  }

  .footer-column {
    text-align: center;
  }
}
</style>
