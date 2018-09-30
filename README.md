
### React sample app for stock analysis and portfolio management

Demo: [magsoft2.github.io/ReactStockAnalyzerDemo](https://magsoft2.github.io/ReactStockAnalyzerDemo)

# Description

todo common some desc

## Architecture

todo desc of app architecture

### Frameworks, libraries and technologies used

todo describe all libs used in the app

- React
- Redux
- Redux-saga - Why: 'Where do I put my business logic in a React Redux application?'



createRequestTypes('USER')



STOCKANALYSIS_DATA_ALL_UPDATE  (force: true or false)
STOCKANALYSIS_DATA_ALL_UPDATE_STARTED
STOCKANALYSIS_DATA_ALL_UPDATE_SUCCEEDED
STOCKANALYSIS_DATA_ALL_UPDATE_FAILED

SECURITY_HISTORY_LOAD
SECURITY_HISTORY_LOAD_STARTED
SECURITY_HISTORY_LOAD_SUCCEEDED
SECURITY_HISTORY_LOAD_FAILED
SECURITY_DESCRIPTION_LOAD
SECURITY_DESCRIPTION_LOAD_STARTED
SECURITY_DESCRIPTION_LOAD_SUCCEEDED
SECURITY_DESCRIPTION_LOAD_FAILED


INDICATOR_ADD
INDICATOR_DELETE


state: {

    securitiesSuggestions: []

	securyties: [
	],
	
	indicators:[],
	
	isLoading: false,
	
	startDate: moment().add(-1, 'years').format(CONSTANTS.dateFormat)	
}


getters ???



TODO:

- get https://iss.moex.com/iss/index.xml all descriptions and make references lists

9. Add requests actions redux-saga
    - getters, saga helpers
10. make better initial list of stocks: GAZP, several indexes, USD_RUB, EUR_RUB
11. Add some Jest unit tests
12. get hist data from diff engines and markets
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