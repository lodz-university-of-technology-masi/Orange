package pl.masi.services.interfaces;

import pl.masi.entities.Position;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface IChoiceService {
    void updateChoice(Long id, String content);
    void deleteChoice(Long id);
}
