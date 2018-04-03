using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace Projects.Entities.MasterData
{
    public class tbl_state : IEntityBase
    {
        [Key]
        public int id { get; set; }
        [ForeignKey("country"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int country_id { get; set; }
        public string state_name { get; set; }
        public string capital { get; set; }

        public virtual tbl_country country { get; set; }
        public virtual ICollection<tbl_city> city { get; set; }
    }
}
