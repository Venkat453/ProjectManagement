using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Projects.Entities.MasterData;

namespace Projects.Entities.Membership
{
    /// <summary>
    /// Projects User Account
    /// </summary>
    public class tbl_user : IEntityBase
    {
        public tbl_user()
        {
            UserRoles = new List<tbl_user_role>();
        }
        public int id { get; set; }
        [ForeignKey("tenant"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public string userid { get; set; }
        public string user_name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string salt { get; set; }
        public bool is_locked { get; set; }
        public bool is_tenant { get; set; }
        public DateTime date_created { get; set; }
        public DateTime date_modified { get; set; }

        public virtual tbl_tenant tenant { get; set; }
        public virtual ICollection<tbl_user_role> UserRoles { get; set; }
    }
}
