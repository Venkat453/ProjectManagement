using Projects.Entities.MasterData;

namespace Projects.Data.Configurations
{
    public class ModuleConfiguration : EntityBaseConfiguration<tbl_module_master>
    {
        public ModuleConfiguration()
        {
            Property(rm => rm.module_name).IsRequired().HasMaxLength(100);
            Property(rm => rm.description).IsRequired().HasMaxLength(200);
        }
    }
}
