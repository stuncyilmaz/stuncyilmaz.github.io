df=data.frame(state.x77)
df['population density']=df$Population/df$ Area
df['State']=row.names(df)
names(df)=c('Population','Income','Illiteracy','Life Expectancy','Murder Rate','HS Graduates','Frost','Area',
            'Population Density','State')


library('Hmisc')
cut2(df[,'Population Density'],g=6)


write.csv(
  df, 
  file = "/home/tunc/Desktop/visualization/hw2/state.x77.csv", 
  row.names = FALSE
)


library(jsonlite)
json <- toJSON(
  df,
  dataframe = "rows",
  factor = "string",
  pretty = TRUE
)
cat(json, file = "/home/tunc/Desktop/visualization/hw2/state.x77.json")