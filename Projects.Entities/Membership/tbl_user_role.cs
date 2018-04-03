using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Projects.Entities.Membership
{
    /// <summary>
    /// Projects User's Role
    /// </summary>
    public class tbl_user_role : IEntityBase
    {
        [Key]
        public int id { get; set; }
        [ForeignKey("user"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int UserId { get; set; }

        [ForeignKey("Roles"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int RoleId { get; set; }
        public virtual tbl_roles Roles { get; set; }
        public virtual tbl_user user { get; set; }
    }
}
