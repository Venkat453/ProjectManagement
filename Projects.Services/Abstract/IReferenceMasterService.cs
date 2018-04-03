using Projects.Entities;
using Projects.Entities.MasterData;
using Projects.Services.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Services
{
    public interface IReferenceMasterService
    {
        //ReferenceContext ValidateGroup(int groupid);
        List<tbl_reference_master> GetReferenceMasterData(int group_id);
        //tbl_reference_master ChangeReferenceValue(int groupid, string referenceitem);
    }
}
