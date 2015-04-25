df=as.data.frame(cbind(Year = floor(time(Seatbelts) + .01), Month = cycle(Seatbelts), Seatbelts))
names(df)[seq(3,10)]=names(data.frame(Seatbelts))
plot(Seatbelts)
plot(Seatbelts[,1])


require(zoo)
as.yearmon("1 2012", "%m %Y")
format(x, "%m")
pasted=paste(df$Month,df$Year)
mydate=sapply(as.yearmon(pasted, "%m %Y"),function(x) format(x, "%Y%m"))
df$date=mydate
df$total=df[,'drivers']+df[,'front']+df[,'rear']

names(df)[which(names(df)=='front')]='front-seat passengers'
names(df)[which(names(df)=='rear')]='rear-seat passengers'

write.csv(
  df, 
  file = "/home/tunc/Desktop/visualization/hw3/drivers.csv", 
  row.names = F
)

cols=c('drivers','front-seat passengers', 'rear-seat passengers' )
df_scaled=df[,cols]
df_scaled=df_scaled/apply(df_scaled,1,sum)*100

df[,names(df_scaled)]=df_scaled

write.csv(
  df, 
  file = "/home/tunc/Desktop/visualization/hw3/drivers_scaled.csv", 
  row.names = F
)

