using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities;
using Projects.Entities.MasterData;
using Projects.Services.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Projects.Data.Extensions;

namespace Projects.Services
{
    public class ReferenceMasterService : IReferenceMasterService
    {
        #region Variables
        private readonly IEntityBaseRepository<tbl_reference_group_master> _refmastergroupRepository;
        private readonly IEntityBaseRepository<tbl_reference_master> _refmasterRepository;
        private readonly IEncryptionService _encryptionService;
        private readonly IUnitOfWork _unitOfWork;
        #endregion

        public ReferenceMasterService(IEntityBaseRepository<tbl_reference_group_master> refmastergroupRepository, 
            IEntityBaseRepository<tbl_reference_master> refmasterRepository,
            IEncryptionService encryptionService, IUnitOfWork unitOfWork)
        {
            _refmastergroupRepository = refmastergroupRepository;
            _refmasterRepository = refmasterRepository;
            _encryptionService = encryptionService;
            _unitOfWork = unitOfWork;
        }

        public List<tbl_reference_master> GetReferenceMasterData(int GroupID)
        {
            var _result = _refmasterRepository.FindBy(X => X.group_id == GroupID);

            return _result.Distinct().ToList();
        }


    }
}
