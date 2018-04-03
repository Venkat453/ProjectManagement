using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Membership
{
    public class tbl_error : IEntityBase 
    {
        public int id { get; set; }

        [StringLength(20)]
        public string tenant_key { get; set; }
        public int user_id { get; set; }
        [StringLength(500)]
        public string message { get; set; }
        public string stacktrace { get; set; }
        public DateTime date_Created { get; set; }
        //public int UserID { get; set; }
    }
}
