using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class ChartTitleViewModel : IEntityBase
    {
        public int id { get; set; } 
        public int userid { get; set; }
        public string user_name { get; set; }
        public List<ChartTitleList> charttitlelist { get; set; }
    }

    public class ChartTitleList
    {
        public int id { get; set; }
        public int chart_id { get; set; }
        public bool is_active { get; set; }
        public string charts_title { get; set; }
    }

    public class ChartTitlesViewModel : IEntityBase
    {
        public int id { get; set; } 
        public int userid { get; set; }
        public string user_name { get; set; }
        public int chart_id { get; set; }
        public bool is_active { get; set; }
        public string charts_title { get; set; } 
    }
}