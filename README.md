
### React sample app for stock analysis and portfolio management

Demo: [magsoft2.github.io/ReactStockAnalyzerDemo](https://magsoft2.github.io/ReactStockAnalyzerDemo)

# Description

todo common some desc

## Architecture

todo desc of app architecture

### Frameworks, libraries and technologies used


- React
- Redux
- Redux-saga - Why: 'Where do I put my business logic in a React Redux application?'


TODO:

+ get https://iss.moex.com/iss/index.xml all descriptions and make references lists

9. + Add requests actions redux-saga
    +- getters, saga helpers
10. make better initial list of stocks: GAZP, several indexes, USD_RUB, EUR_RUB
11. Add some Jest unit tests
12. PERFOMANCE analysis, react perf. tools etc.
13. refactor stock chart code

20. Portfolio manager
    - one/two stocks at port by default
    - some react grid?
    - Add\delete stocks to list
    - change position
    - show portfolio hist chart
    - add common index from list to compare
    - risk(volatility)-income bubbles chart
    - factor analysis on indexes set: securitycollections
    - make .Net Core back service for factor analysis?
101. How to make selector of DataProviders?
102.  find more free providers. quandl?