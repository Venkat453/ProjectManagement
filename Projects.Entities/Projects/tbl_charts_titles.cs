using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
    public class tbl_charts_titles : IEntityBase
    {
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int userid { get; set; }
        public string user_name { get; set; }
        public int chart_id { get; set; }
        public bool is_active { get; set; }
        public string charts_title { get; set; }


    }
}
