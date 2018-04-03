using AutoMapper;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Projects.Web.Controllers
{
    [RoutePrefix("api/ProjectMaster")]
    public class ProjectMasterController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_project_master> _projectMasterRepository;
        public readonly IEntityBaseRepository<tbl_project_master_child> _projectMasterChildRepository;

        public ProjectMasterController(IEntityBaseRepository<tbl_project_master> projectMasterRepository,
            IEntityBaseRepository<tbl_project_master_child> projectMasterChildRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _projectMasterRepository = projectMasterRepository;
            _projectMasterChildRepository = projectMasterChildRepository;
        }

        [HttpGet]
        [Route("GetProjectMasterList")]
        public HttpResponseMessage GetProjectMasterList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var projectMasterList = _projectMasterRepository.GetAll();
                IEnumerable<ProjectMasterViewModel> projectMastervm = Mapper.Map<IEnumerable<tbl_project_master>, IEnumerable<ProjectMasterViewModel>>(projectMasterList);
                response = request.CreateResponse<IEnumerable<ProjectMasterViewModel>>(HttpStatusCode.OK, projectMastervm);
                return response;
            });
        }

        [HttpGet]
        [Route("GetProjectMasterList")]
        public HttpResponseMessage GetProjectMasterChildList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var projectMasterChildList = _projectMasterChildRepository.GetAll();
                IEnumerable<ProjectMasterChildViewModel> projectMasterChildvm = Mapper.Map<IEnumerable<tbl_project_master_child>, IEnumerable<ProjectMasterChildViewModel>>(projectMasterChildList);
                response = request.CreateResponse<IEnumerable<ProjectMasterChildViewModel>>(HttpStatusCode.OK, projectMasterChildvm);
                return response;
            });
        }


    }
}