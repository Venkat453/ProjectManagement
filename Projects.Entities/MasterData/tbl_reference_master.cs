using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Projects.Entities.MasterData
{
    public class tbl_reference_master : IEntityBase
    {
        [Key]
        public int id { get; set; }

        [ForeignKey("ref_group_master"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int group_id { get; set; }

        public string reference_item { get; set; }
        public string reference_value { get; set; }
        public string description { get; set; }

        public virtual tbl_reference_group_master ref_group_master { get; set; }
    }
}
