## hardhat

Hardhat is developmend environment.

easy compile, deploy, test and debug EVM based smart contracts.

## npm packages with @ and without

This is feature of npm called 'scoped packages', which effectively allow npm packages to be namespaced.
This is useful for several reasons:

- it allows organizations to make it clear which packages are 'official' and which ones are not, e.g. if
  package
  has scope @angular, you know it was published by the Angular core team.

Dlaczego używa się zakresów?

- Organizacja i struktura: Umożliwia lepszą organizację pakietów, co jest szczególnie przydatne w dużych
  projektach i organizacjach.
- Prywatność: Scoped packages mogą być prywatne, co oznacza, że dostęp do nich mają tylko określone osoby lub
  zespoły.
- Niezależność: Pakiety z zakresem mogą być wersjonowane i publikowane niezależnie od innych pakietów, co
  ułatwia zarządzanie zależnościami i wersjami.

## what is typechain

TypeChain to biblioteka, która służy do generowania typów TypeScript dla kontraktów Ethereum. Umożliwia to
bezpieczne typowanie podczas pracy z inteligentnymi kontraktami w aplikacjach TypeScript. Dzięki TypeChain
możesz łatwo korzystać z typowanych interfejsów do interakcji z inteligentnymi kontraktami, co poprawia wygodę
kodowania oraz zmniejsza ryzyko błędów.

TypeChain generuje typy na podstawie ABI (Application Binary Interface) Twoich kontraktów.

## Mocha and Chai

Mocha i Chai nie są konkurencyjne, lecz uzupełniają się nawzajem:

Mocha zapewnia strukturę i mechanizm do uruchamiania testów.
Chai dostarcza narzędzi do formułowania warunków, które testy mają sprawdzać.