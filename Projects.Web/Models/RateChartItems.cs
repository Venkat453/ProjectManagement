using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class RateChartItems
    {
        public int fieldwork_id { get; set; }
        public string fieldwork_description { get; set; }

        public string unitofmeasurement { get; set; }

        public float price { get; set; }
    }
}