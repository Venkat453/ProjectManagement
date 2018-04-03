
using Projects.Entities.MasterData;

namespace Projects.Data.Configurations
{
    public class ReferenceMasterConfiguration : EntityBaseConfiguration<tbl_reference_master>
    {
        public ReferenceMasterConfiguration()
        {
            Property(rm => rm.group_id).IsRequired();
            Property(rm => rm.reference_item).IsRequired().HasMaxLength(100);
            Property(rm => rm.reference_value).IsRequired().HasMaxLength(100);
            Property(rm => rm.description).HasMaxLength(200);
        }
    }
}
