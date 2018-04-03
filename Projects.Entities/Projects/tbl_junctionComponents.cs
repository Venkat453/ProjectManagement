using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Projects.Entities.MasterData;

namespace Projects.Entities.Projects
{
    public class tbl_junctionComponents : IEntityBase
    {
        [Key]
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        [ForeignKey("junction"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int junction_id { get; set; }
        public string component { get; set; }
        public int quantity { get; set; }        
        public virtual tbl_junction junction { get; set; }
    }
}
