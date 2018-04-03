using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Projects.Entities.Membership;

namespace Projects.Entities.MasterData
{
    public class tbl_menu_access : IEntityBase
    {
        public int id { get; set; }
        [ForeignKey("menu"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int menu_id { get; set; }
        //[ForeignKey("user"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int user_id { get; set; }
        [ForeignKey("tenant"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public bool is_active { get; set; }

        public virtual tbl_menu menu { get; set; }
        //public virtual tbl_user user { get; set; }
        public virtual tbl_tenant tenant { get; set; }

    }
}
