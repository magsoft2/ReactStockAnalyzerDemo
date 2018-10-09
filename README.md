
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

 PortfolioProcessor()
 DataAnalysis()
11. Add some Jest unit tests
12. PERFOMANCE analysis
13. current date and WhatIf date selector

20. Portfolio manager
    - add common index from list to compare
    - risk(volatility)-income bubbles chart
    - factor analysis on indexes set: securitycollections
    - make .Net Core back service for factor analysis?
    - pivot by sectors etc?

101. Dataprovider selector (quandl etc)