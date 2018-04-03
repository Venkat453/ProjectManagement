using AutoMapper;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Infrastructure.Extensions;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using static System.Console;


namespace Projects.Web.Controllers
{
    [RoutePrefix("api/ProjectMaster")]

    public class ProjectMasterController : ApiControllerBase
    {

            public readonly IEntityBaseRepository<tbl_project_master> _projectRepository;
            

            public ProjectMasterController(IEntityBaseRepository<tbl_project_master> projectRepository,
                IEntityBaseRepository<tbl_error> _errorsRepository, IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
            {
             _projectRepository = projectRepository;
               
            }



        [HttpPost]
        [Route("SaveProjectMaster")]
        public HttpResponseMessage SaveProjectMaster(HttpRequestMessage request, ProjectMasterViewModel project)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    
                    tbl_project_master newProjectMaster = new tbl_project_master();
                    newProjectMaster.AddProjectMaster(project);
                    _projectRepository.Add(newProjectMaster);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<ProjectMasterViewModel>(HttpStatusCode.Created, project);
                }
                return response;
            });
        }
         
        [HttpGet]
        [Route("GetProjectsList/{tenant_id:int}")]
        public HttpResponseMessage GetProjectsList(HttpRequestMessage request, int tenant_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var ProjectsList = _projectRepository.GetAll().Where(x => x.tenant_id == tenant_id);
                IEnumerable<ProjectMasterViewModel> Projectslistvm = Mapper.Map<IEnumerable<tbl_project_master>, IEnumerable<ProjectMasterViewModel>>(ProjectsList);
                response = request.CreateResponse<IEnumerable<ProjectMasterViewModel>>(HttpStatusCode.OK, Projectslistvm);
                return response;

            });
        }


    }
}