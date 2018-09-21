
### React sample app for Stock analysis and portfolio management

Demo: [magsoft2.github.io/ReactStockAnalyzerDemo](https://magsoft2.github.io/ReactStockAnalyzerDemo)

todo some desc

# Description

todo common some desc

## Architecture

todo desc of app architecture

### Frameworks, libraries and technologies used

todo describe all libs used in the app

- React
- Redux
- Redux-saga




TODO:

- get https://iss.moex.com/iss/index.xml all descriptions and make references lists

2. add LogService
3. make stock selector with suggestions
	+ show full stock info in popup/modal? (https://iss.moex.com/iss/securities/IMOEX.json)
4. selected stock list with add\delete
5. adding indicators to stock list/ predefined set?
5.5 tune chart: show dateRange lins (1d 1w 1m 3m), chart type selector
6. store\restore settings\project in storage
7. get hist data from diff engines and markets
8. Fill about page
9. Add some Jest unit tests
10. Add requests actions redux-saga

10. Portfolio manager
    - one/two stocks at port by default
    - Add\delete stocks to list
    - change position
    - show portfolio hist chart
    - add common index from list to compare
    - risk(volatility)-income bubbles chart
101. How to make selector of DataProviders?
102.  find more free providers. quandl?