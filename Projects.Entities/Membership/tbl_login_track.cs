using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Projects.Entities.MasterData;

namespace Projects.Entities.Membership
{
    public class tbl_login_track : IEntityBase
    {
        public int id { get; set; }
        public string tenant_key { get; set; }
        public int user_id { get; set; }
        //public string user_name { get; set; }
        public DateTime login_time { get; set; }
        public string login_ip { get; set; }
        public string location { get; set; }
    }
}
