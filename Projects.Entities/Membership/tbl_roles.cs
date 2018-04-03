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
    /// Projects Role
    /// </summary>
    public class tbl_roles : IEntityBase
    {
        [Key]
        public int id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<tbl_user_role> userrole { get; set; }
    }
}
