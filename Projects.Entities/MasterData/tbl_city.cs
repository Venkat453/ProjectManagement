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
    public class tbl_city : IEntityBase
    {
        [Key]
        public int id { get; set; }
        [ForeignKey("state"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int state_id { get; set; }
        public string city_name { get; set; }

        public virtual tbl_state state { get; set; }
    }
}
