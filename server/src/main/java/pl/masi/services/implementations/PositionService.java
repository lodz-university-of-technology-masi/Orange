package pl.masi.services.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import pl.masi.entities.Position;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.PositionRepository;
import pl.masi.services.interfaces.IPositionService;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PositionService implements IPositionService {

    private final PositionRepository positionRepository;

    @Override
    public Position createPosition(Position position) throws AppException {
        try {
            return positionRepository.save(position);
        } catch (DuplicateKeyException e){
            throw new AppException("POSITION_DUPLICATE_NAME", "Position with given name already exists");
        }
    }

    @Override
    public boolean togglePosition(String name, boolean isActive) throws AppException {
        Position position = positionRepository.findByName(name);
        if(position == null){
            throw new AppException("POSITION_NOT_FOUND", "Position with given name does not exists");
        }
        position.setActive(isActive);
        return positionRepository.save(position).isActive();
    }


}
