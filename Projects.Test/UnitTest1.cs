using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Projects.Web.Controllers;
using Projects.Web.Models;
using Projects.Data.Repositories;
using Projects.Entities.Projects;
using Projects.Entities.Membership;
using Projects.Data.Infrastructure;
using System.Collections.Generic;
using Projects.Data;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using AutoMapper;
using System.Linq;
using TestHelper;
using Moq;
using Projects.Services;
using System.Web.Http.Hosting;
using System.Net;
using Newtonsoft.Json;

namespace Projects.Test
{
    [TestClass]
    public class UnitTest1
    {
        public IUnitOfWork _unitOfWork;
        private List<tbl_employee> employees;
        private DBConnect _dbEntities;
        public readonly IEntityBaseRepository<tbl_employee> _employeeRepository;
        public readonly IEntityBaseRepository<tbl_settings> _settingsRepository;
        public readonly IEntityBaseRepository<tbl_error> _errorsRepository;
        public readonly IEntityBaseRepository<tbl_project_master> _projectRepository;



        //[TestMethod]
        //public void GetAllEmployeesTest()
        //{
        //    Mock<IEntityBaseRepository<tbl_employee>> mockRepository = new Mock<IEntityBaseRepository<tbl_employee>>();
        //    mockRepository.Setup(x => x.GetAll());


        //    var controller = new EmployeeController(_settingsRepository,mockRepository.Object,_errorsRepository,_unitOfWork);
        //    controller.Request=new HttpRequestMessage();
        //    controller.Configuration = new HttpConfiguration();

        //    var expResult = DataInitializer.GetAllEmployees();            

        //    var response = controller.GetEmployeesList(new HttpRequestMessage());
        //    tbl_employee employee;
        //    Assert.IsTrue(response.TryGetContentValue<tbl_employee>(out employee));
        //    Assert.AreEqual("SUKHADEV", employee.emp_name);
        //    //CollectionAssert.AreEqual(expResult, employee);
        //}

        [TestMethod]
        public void SaveProjectTest()
        {
            var _projectRepositoryMock = new Mock<IEntityBaseRepository<tbl_project_master>>();
            var _errorsRepositoryMock = new Mock<IEntityBaseRepository<tbl_error>>();
            var _unitOfWorkMock = new Mock<IUnitOfWork>();
            var mockMapper = new Mock<IMapper>();

            //var list = new List<tbl_project_master>
            //    {
            //        new tbl_project_master{id=1,tenant_id=1,project_name="SmartCity"},
            //        new tbl_project_master{id=2,tenant_id=1,project_name="Sales"},
            //        new tbl_project_master{id=3,tenant_id=1,project_name="Ecommerce"},
            //    };

            //_projectRepositoryMock.Setup(x => x.GetSingle(1)).Returns(new tbl_project_master { id = 1, tenant_id = 1, project_name = "SmartCity" });

            var controller = new ProjectMasterController(_projectRepositoryMock.Object, _errorsRepositoryMock.Object, _unitOfWorkMock.Object);
            var config = new HttpConfiguration();
            controller.Configuration = config;
            var Request = new HttpRequestMessage(HttpMethod.Post, "http://localhost:34351/api/ProjectMaster/SaveProjectMaster");
            Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;

            var newProject = new ProjectMasterViewModel()
            {
                project_name="Inventory Mgmt"
            };

            var response=controller.SaveProjectMaster(Request,newProject);
            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);            
            var newSavedProject = JsonConvert.DeserializeObject<tbl_project_master>(response.Content.ReadAsStringAsync().Result);

            Assert.AreEqual("Inventory Mgmt", newSavedProject.project_name);
            //Assert.AreEqual(newProject.project_name, _projectRepository.GetAll().OrderByDescending(x=>x.id).First().project_name);
        }



        [TestMethod]
        public void GetProjectById()
        {
            var _projectRepositoryMock = new Mock<IEntityBaseRepository<tbl_project_master>>();
            var _errorsRepositoryMock = new Mock<IEntityBaseRepository<tbl_error>>();
            var _unitOfWorkMock = new Mock<IUnitOfWork>();
            var mockMapper = new Mock<IMapper>();            

            //var list = new List<tbl_project_master>
            //    {
            //        new tbl_project_master{id=1,tenant_id=1,project_name="SmartCity"},
            //        new tbl_project_master{id=2,tenant_id=1,project_name="Sales"},
            //        new tbl_project_master{id=3,tenant_id=1,project_name="Ecommerce"},
            //    };

            _projectRepositoryMock.Setup(x => x.GetSingle(1)).Returns(new tbl_project_master { id = 1, tenant_id = 1, project_name = "SmartCity" });

            var controller = new ProjectMasterController(_projectRepositoryMock.Object, _errorsRepositoryMock.Object, _unitOfWorkMock.Object);           
            var config = new HttpConfiguration();
            controller.Configuration = config;
            var Request= new HttpRequestMessage(HttpMethod.Get, "http://localhost:34351/api/ProjectMaster/GetProjectsById/1");
            Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;

            var response = controller.GetProjectsById(Request, 1);
            
            tbl_project_master project;
            Assert.IsTrue(response.TryGetContentValue<tbl_project_master>(out project));
            Assert.AreEqual("SmartCity", project.project_name);
        }


        [TestMethod]
        public void GetProjectByIdIActionTest()
        {
            var _projectRepositoryMock = new Mock<IEntityBaseRepository<tbl_project_master>>();
            var _errorsRepositoryMock = new Mock<IEntityBaseRepository<tbl_error>>();
            var _unitOfWorkMock = new Mock<IUnitOfWork>();
            var mockMapper = new Mock<IMapper>();
            //        mockMapper.Setup(x => x.Map<tbl_project_master,ProjectMasterViewModel>(It.IsAny<tbl_project_master>()))
            //.Returns(new ProjectMasterViewModel());

            _projectRepositoryMock.Setup(x => x.GetSingle(1)).Returns(new tbl_project_master { id = 1, tenant_id = 1, project_name = "SmartCity" });

            var controller = new ProjectMasterController(_projectRepositoryMock.Object, _errorsRepositoryMock.Object, _unitOfWorkMock.Object);
            var request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            IHttpActionResult actionResult = controller.GetProjectsByIdIAction(1);
            var contentResult = actionResult as OkNegotiatedContentResult<tbl_project_master>;
            Assert.AreEqual("SmartCity", contentResult.Content.project_name);
        }

        //[TestMethod]
        //public void GetProjectByIdIActionTest()
        //{
        //    var _projectRepositoryMock = new Mock<IEntityBaseRepository<tbl_project_master>>();
        //    var _errorsRepositoryMock = new Mock<IEntityBaseRepository<tbl_error>>();
        //    var _unitOfWorkMock = new Mock<IUnitOfWork>();
        //    var mockMapper = new Mock<IMapper>();
        //    //        mockMapper.Setup(x => x.Map<tbl_project_master,ProjectMasterViewModel>(It.IsAny<tbl_project_master>()))
        //    //.Returns(new ProjectMasterViewModel());
        //    var plist  = new List<tbl_project_master>
        //            {
        //                new tbl_project_master{id=1,tenant_id=1,project_name="SmartCity"},
        //                new tbl_project_master{id=2,tenant_id=1,project_name="Sales"},
        //                new tbl_project_master{id=3,tenant_id=1,project_name="Ecommerce"},
        //            };
        //    _projectRepositoryMock.Setup(x => x.GetAll()).Returns(plist);

        //    var controller = new ProjectMasterController(_projectRepositoryMock.Object, _errorsRepositoryMock.Object, _unitOfWorkMock.Object);
        //    var request = new HttpRequestMessage();
        //    controller.Configuration = new HttpConfiguration();

        //    IHttpActionResult actionResult = controller.GetProjectsByIdIAction(1);
        //    var contentResult = actionResult as OkNegotiatedContentResult<tbl_project_master>;
        //    Assert.AreEqual("SmartCity", contentResult.Content.project_name);
        //}

        [TestMethod]
        public void SumTest()
        {
            
            var controller = new ProjectMasterController(_projectRepository, _errorsRepository, _unitOfWork);
            var response = controller.Addnos(5, 3);
            Assert.AreEqual(8, response);
        }



        //private Mock<IMembershipService> _membershipServiceMock;
        //AccountController objController;
        //List<tbl_user> listUser;

        //[TestInitialize]
        //public void Initialize()
        //{

        //    _membershipServiceMock = new Mock<IMembershipService>();
        //    //objController = new AccountController(_membershipServiceMock.Object);
        //    listUser = new List<tbl_user>() {
        //   new tbl_user() {id=1,tenant_id=1,userid="1000071044288483",user_name="Oakridge IT Solutions",email="venkat.kareti@outlook.com" }           
        //  };
        //}

        //[TestMethod]
        //public void GetAllMyUsersTest()
        //{
        //    //_membershipServiceMock.Setup(x => x.GetAllUsers()).Returns(listUser);
        //}
    }
}
