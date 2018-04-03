using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
    public class tbl_Log : IEntityBase
    {
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int userid { get; set; }
        public string user_name { get; set; }

        public string ip_address { get; set; }

        public string page_url { get; set; }
        public string reference_url { get; set; }
        public DateTime created_date { get; set; }


    }
}
