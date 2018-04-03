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
    public class tbl_reference_group_master : IEntityBase
    {
        [Key]
        public int id { get; set; }
        public int group_id { get; set; }
        public string reference_item { get; set; } 
        public string description { get; set; }
        public virtual ICollection<tbl_reference_master> ref_master { get; set; }
    }

}
