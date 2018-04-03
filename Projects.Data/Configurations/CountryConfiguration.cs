using Projects.Data.Configurations;
using Projects.Entities;
using Projects.Entities.MasterData;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tapClouds.Data.Configurations
{
    public class CountryConfiguration : EntityBaseConfiguration<tbl_country>
    {
        public CountryConfiguration()
        {
            Property(c => c.iso_code).IsRequired().HasMaxLength(2);
            Property(c => c.country_name).IsRequired().HasMaxLength(50);
            Property(c => c.capital).HasMaxLength(50);
            Property(c => c.country_code).HasMaxLength(10);
            
        }
    }
}
