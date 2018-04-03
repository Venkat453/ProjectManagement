using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Projects.Web.Infrastructure.Validators;
using Projects.Entities;

namespace Projects.Web.Models
{
    public class PackingViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string code { get; set; }
        public string unit { get; set; }
    }
}