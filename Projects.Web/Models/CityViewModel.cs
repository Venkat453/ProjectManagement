using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Projects.Web.Infrastructure.Validators;

namespace Projects.Web.Models
{
    public class CityViewModel
    {
        public int id { get; set; }
        public int state_id { get; set; }
        public string city_name { get; set; }
    }
}