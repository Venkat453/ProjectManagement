using Projects.Entities;
using Projects.Entities.Membership;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Data.Configurations
{
    public class UserConfiguration : EntityBaseConfiguration<tbl_user>
    {
        public UserConfiguration()
        {
            Property(u => u.userid).IsRequired().HasMaxLength(20);
            Property(u => u.user_name).IsRequired().HasMaxLength(50);
            Property(u => u.email).IsRequired().HasMaxLength(50);
            Property(u => u.password).IsRequired().HasMaxLength(200);
            Property(u => u.salt).IsRequired().HasMaxLength(200);
            Property(u => u.is_locked).IsRequired();
            Property(u => u.date_created);
        }
    }

}
