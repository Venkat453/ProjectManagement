using Projects.Data;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Services;
using Projects.Services.Utilities;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Infrastructure.Extensions;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Projects.Web.Controllers;
using AutoMapper;
using System.IO;
using System.Web;
using System.Configuration;

namespace Projects.Web.Controllers
{
    [RoutePrefix("api/ProjectComponents")]
    public class ProjectComponentsController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_project_components> _projectComponentsRepository;

        public ProjectComponentsController(IEntityBaseRepository<tbl_project_components> projectComponentsRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _projectComponentsRepository = projectComponentsRepository;
        }

        [HttpPost]
        [Route("SaveComponents")]
        public HttpResponseMessage SaveComponents(HttpRequestMessage request, ProjectComponentsViewModel components)
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
                    var newComponent = new tbl_project_components();
                    for(var i=0;i<components.componentdetails.Count;i++)
                    {
                        newComponent.tenant_id = components.tenant_id;
                        newComponent.project_id = components.project_id;
                        newComponent.component = components.componentdetails[i].component;
                        newComponent.uom = components.componentdetails[i].uom;
                        newComponent.description = components.componentdetails[i].description;
                        newComponent.created_date = DateTime.Now;
                        newComponent.modified_date = DateTime.Now;

                        _projectComponentsRepository.Add(newComponent);
                        _unitOfWork.Commit();
                    }                    
                    response = request.CreateResponse<ProjectComponentsViewModel>(HttpStatusCode.Created, components);
                }
                return response;
            });
        }

        [HttpGet]
        [Route("getComponentsList/{tenant_id:int}")]
        public IHttpActionResult getJunctionsList(HttpRequestMessage request, int tenant_id)
        {
            DBConnect contextObj = new DBConnect();
            var componentslist = (from c in contextObj.ProjectsComponentsSet.Where(x=>x.tenant_id== tenant_id)
                                  join p in contextObj.ProjectMaster on c.project_id equals p.id
                                  select new
                                  {
                                      id=c.id,
                                      project_id = c.project_id,
                                      project_name=p.project_name,
                                     component =c.component,
                                     description=c.description,
                                     uom=c.uom
                                 });
            return Ok(componentslist);
        }


        [HttpGet]
        [Route("Searchcoponents/{filter?}")]
        public IHttpActionResult Searchcoponents(HttpRequestMessage request, string filter = null)
        {
            //filter = filter.ToLower().Trim();

            var projects = _projectComponentsRepository.GetAll()
                .Where(c => c.component.ToLower().Contains(filter) ||
                c.description.ToLower().Contains(filter));

                return Ok(projects); 
        }
    }
}