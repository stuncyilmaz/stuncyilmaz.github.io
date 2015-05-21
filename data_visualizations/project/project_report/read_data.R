library(ggplot2)
df=movies
df=df[,-c(4)]

write.csv(df, "data.csv", row.names=FALSE)
