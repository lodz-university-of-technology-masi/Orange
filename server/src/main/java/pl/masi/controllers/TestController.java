package pl.masi.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.ITestService;
import pl.masi.entities.Test;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value="/test")
public class TestController {

    @Autowired
    private ITestService testService;

    @GetMapping
    @RequestMapping(value="/all")
    public List<Test> getAllTests() {
        return testService.getAllTests();
    }

    @GetMapping
    @RequestMapping(value = "/{id}")
    public Test getTestById(@PathVariable Long id) throws AppException {
        return testService.getById(id);
    }

    @DeleteMapping(value = "/{id}")
    public void deleteTestById(@PathVariable Long id) throws AppException {
        testService.deleteById(id);
    }

    @PutMapping(value = "/{id}")
    public boolean updateTest(
            @PathVariable Long id,
            @RequestParam("test") Test test) throws AppException {
        return testService.updateTest(id, test);
    }

    @ExceptionHandler({AppException.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
