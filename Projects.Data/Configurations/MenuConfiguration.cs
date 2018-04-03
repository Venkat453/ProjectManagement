using Projects.Entities;
using Projects.Entities.MasterData;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Data.Configurations
{
    class MenuConfiguration : EntityBaseConfiguration<tbl_menu>
    {
        public MenuConfiguration()
        {
            Property(m => m.id).IsRequired();
            Property(m => m.name).IsRequired().HasMaxLength(50);
            Property(m => m.url).HasMaxLength(100);
            Property(m => m.icon).HasMaxLength(100);
            Property(m => m.tooltip).HasMaxLength(100);
            Property(m => m.category).HasMaxLength(100);
            Property(m => m.menu_for).HasMaxLength(100);
        }
    }
}
