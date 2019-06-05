package pl.masi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.masi.beans.TestResolutionBean;
import pl.masi.entities.TestResolution;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.ITestResolutionService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value="/testResolution")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class TestResolutionController {

    private final ITestResolutionService testResolutionService;
    @Autowired
    private HttpServletRequest request;

    @PostMapping(value = "/create")
    public void createTestResolution(@RequestBody TestResolutionBean testResolutionBean) throws AppException {
        testResolutionService.addTestResolution(testResolutionBean);
    }

    @GetMapping
    @RequestMapping(value = "/list")
    public List<TestResolution> getAllResolvedTests() {
        return testResolutionService.getAllResolvedTests(request.getHeader("role"));
    }

    @GetMapping
    @RequestMapping(value = "/list/{id}")
    public TestResolution getTestResolutionById(@PathVariable Long id) {
        return testResolutionService.getTestResolutionById(id);
    }


    @GetMapping
    @RequestMapping(value = "/list/test/{testName}")
    public List<TestResolution> getTestResolutionsByTestName(@PathVariable String testName) {
        return testResolutionService.getTestResolutionsByTestName(request.getHeader("role"), testName);
    }

    @ExceptionHandler({Exception.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
