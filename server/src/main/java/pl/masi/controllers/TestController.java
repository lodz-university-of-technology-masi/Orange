package pl.masi.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import pl.masi.beans.TestBean;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.ITestService;
import pl.masi.entities.Test;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/test")
public class TestController {

    @Autowired
    private ITestService testService;

    @PostMapping
    public void addTest(@RequestBody TestBean testBean) {
        testService.add(testBean);
    }

    @GetMapping
    @RequestMapping(value = "/list")
    public List<Test> getAllTests() {
        return testService.getAllTests();
    }

    @GetMapping
    @RequestMapping(value = "/{name}")
    public Test getTestByName(@PathVariable String name) throws AppException {
        return testService.getByName(name);
    }

    @DeleteMapping(value = "/{name}")
    public void deleteTestByName(@PathVariable String name) throws AppException {
        testService.deleteByName(name);
    }

    @PutMapping(value = "/{testName}/{questionName}")
    public void addQuestion(@PathVariable String testName, @PathVariable String questionName) throws AppException {
        testService.addQuestion(testName, questionName);
    }

    @PutMapping(value = "/updatePosition")
    public void updatePosition(@RequestBody TestBean testBean) throws AppException {
        testService.updatePosition(testBean);
    }

    @PutMapping(value = "/updateName")
    public void updateName(@RequestBody TestBean testBean) throws AppException {
        testService.updateName(testBean);
    }

    @DeleteMapping(value = "/{testName}/{questionName}")
    public void deleteQuestion(@PathVariable String testName, @PathVariable String questionName) throws AppException {
        testService.deleteQuestion(testName, questionName);
    }

    @ExceptionHandler({AppException.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
