using Projects.Entities;
using Projects.Entities.MasterData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Services.Utilities
{
    public class ReferenceContext
    {
        public IPrincipal Principal { get; set; }
        public tbl_reference_master ref_master { get; set; }
        public bool IsValid()
        {
            return Principal != null;
        }
    }
}
