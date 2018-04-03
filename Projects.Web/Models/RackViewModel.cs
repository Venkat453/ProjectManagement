using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Entities;

namespace Projects.Web.Models
{
    public class RackViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string rack { get; set; }
        public string description { get; set; }
    }
}