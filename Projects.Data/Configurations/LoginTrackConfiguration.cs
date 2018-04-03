using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Projects.Entities.Membership;

namespace Projects.Data.Configurations
{
    public class LoginTrackConfiguration : EntityBaseConfiguration<tbl_login_track>
    {
        public LoginTrackConfiguration()
        {
            Property(l => l.id).IsRequired();
            Property(l => l.tenant_key).IsRequired().HasMaxLength(20);
            Property(l => l.user_id).IsRequired();
            Property(l => l.login_ip).HasMaxLength(20);
            Property(l => l.location).HasMaxLength(30);
        }
    }
}
