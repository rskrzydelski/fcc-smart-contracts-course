## Solhint

Solidity linter - analize code for potential errors.
We can use file .solhint.json for linter configuration.

Eg. usage:

```bash
yarn solhint contracts/*.sol
```

## tests

- unit tests are done locally (local hardhat or forked hardhat network)
- integration tests are designed to test the interaction between different modules or services in your
  application
- staging tests can be done on a testnet - last stop! Staging tests are performed in a staging environment,
  which is a replica of the production environment.
  The goal is to ensure that the entire system behaves as expected before deploying to production.

