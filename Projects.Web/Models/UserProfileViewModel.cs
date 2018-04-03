using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class UserProfileViewModel :IEntityBase
    {
        public int id { get; set; } 
        public int tenant_id { get; set; }
        public string userid { get; set; }
        public string user_name { get; set; }
        public string domain { get; set; }
        public byte[] logo { get; set; }
        public string logo_image_type { get; set; }
        public string email { get; set; }
        public string contact_no { get; set; }
        public string alt_contact_no { get; set; }
    }
}