using Projects.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class ChartOrderViewModel : IEntityBase
    { 
            public int id { get; set; } 
            public int userid { get; set; }
            public string user_name { get; set; } 
            public string charts_order { get; set; } 

    }

}