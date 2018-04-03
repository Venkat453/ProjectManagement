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
   public class tbl_junction: IEntityBase
    {
        public tbl_junction()
        {
            junComponents = new HashSet<tbl_junctionComponents>();
        }

        [Key]
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public int ps_id { get; set; }        
        public string junction_name { get; set; }
        public DateTime created_date { get; set; }
        public int created_by { get; set; }
        public DateTime modified_date { get; set; }
        public int modified_by { get; set; }
        public virtual ICollection<tbl_junctionComponents> junComponents { get; set; }


    }
}
