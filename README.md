
### React sample app for stock analysis and portfolio management

Demo: [magsoft2.github.io/ReactStockAnalyzerDemo](https://magsoft2.github.io/ReactStockAnalyzerDemo)

# Description

Sample application for stock and portfolio analysis, based on free data providers (moex only for now).

## Details

Async and complex actions are processed with the aid of Redux-saga ('Where do I put my business logic in a React Redux application?'), 
simple actions with Redux.
User changes are kept in localStorage.
Responsive web design.


TODO:

 - normalize: securities array. positions and secList contains only secId
 - Add some Jest unit tests

20. Portfolio manager
    - factor analysis on indexes set: securitycollections
    - make .Net Core back service for factor analysis?
    - pivot by sectors etc?
    - current date and WhatIf date selector

101. Dataprovider selector (quandl etc)