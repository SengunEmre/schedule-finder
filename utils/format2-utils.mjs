/*
{
    "ts": {
      "ts1": {
        "Arrival": "Tue 20th Aug 2024 22:00",
        "Port": "ANTWERP",
        "PortCode": "BEANR",
        "Departure": "Sat 24th Aug 2024 18:00"
      }
    },
    "Carrier": "MSC",
    "Pol": "ALIAGA",
    "PolCode": "TRALI",
    "PolDeparture": "Mon 5th Aug 2024 22:30",
    "Pod": "ROTTERDAM",
    "PodCode": "NLRTM",
    "PodArrival": "Sun 25th Aug 2024 06:00"
  }

    pol ts1 ts2 ts3 pod
    ts1 wt1 ts2 wt2 ts3 wt3 t4

    ts1 = ts1.Arrival - PolDeparture        
    wt1 = ts1.Arrival - ts1.Departure 
    ts2 = ts1.Departure - ts2.Arrival
    wt2 = ts2.Arrival - ts2.Departure
    ts3 = ts2.Departure - ts3.Arrival 
    wt3 = ts3.Arrival - ts3.Departure
    ts4 = ts3.Departure - ts4.Arrival 

    wt easy 

    ts de easy
    
    obj = {}
    

*/